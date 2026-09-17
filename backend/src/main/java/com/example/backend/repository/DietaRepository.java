package com.example.backend.repository;

import com.example.backend.entity.Dieta;
import com.example.backend.entity.Treinos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DietaRepository  extends JpaRepository<Dieta,Long> {
    List<Dieta> findByAlunoIdId(Long alunoId);
}
