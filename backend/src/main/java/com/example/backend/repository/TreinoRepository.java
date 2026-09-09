package com.example.backend.repository;

import com.example.backend.entity.Treinos;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreinoRepository extends JpaRepository<Treinos,Long> {

    List<Treinos> findByAlunoIdId(Long alunoId);
}
